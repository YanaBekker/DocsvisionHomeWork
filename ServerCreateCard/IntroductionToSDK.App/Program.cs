using DocsVision.BackOffice.CardLib.CardDefs;
using DocsVision.BackOffice.ObjectModel;
using DocsVision.BackOffice.ObjectModel.Services;
using DocsVision.Platform.ObjectManager;
using DocsVision.Platform.ObjectModel;
using DocsVision.Platform.ObjectModel.Search;
using IntroductionToSDK.App;

namespace IntroductionToSDK {
	internal class Program {
		public static void Main(string[] args) {
			var serverURL = System.Configuration.ConfigurationManager.AppSettings["DVUrl"];
			var username = System.Configuration.ConfigurationManager.AppSettings["Username"];
			var password = System.Configuration.ConfigurationManager.AppSettings["Password"];

			var sessionManager = SessionManager.CreateInstance();
			sessionManager.Connect(serverURL, String.Empty, username, password);

			UserSession? session = null;
			try {
				session = sessionManager.CreateSession();
				var context = CreateContext(session);
				CreateMultipleBusinessTripRequests(session, context, 1);
				//CreateBusinessTripRequest(session, context);
				Console.WriteLine("Press any key to continue...");
				Console.ReadKey();
			} finally {
				session?.Close();
				Console.ReadLine();
			}
		}
		public static ObjectContext CreateContext(UserSession session) {
			return ContextFactory.CreateContext(session);
		}
		static void ChangeCardState(ObjectContext context, Document card, string targetState) {
			if (targetState != "Project") {
				IStateService stateSvc = context.GetService<IStateService>();
				if (targetState == "UnderApproval") {
					var branch = stateSvc.FindLineBranchesByStartState(card.SystemInfo.State)
						.FirstOrDefault(s => s.EndState.DefaultName == targetState);
					stateSvc.ChangeState(card, branch);
				} else if (targetState == "OnRegistration") {
					var branch = stateSvc.FindLineBranchesByStartState(card.SystemInfo.State)
						.FirstOrDefault(s => s.EndState.DefaultName == "UnderApproval");
					stateSvc.ChangeState(card, branch);
					branch = stateSvc.FindLineBranchesByStartState(card.SystemInfo.State)
						.FirstOrDefault(s => s.EndState.DefaultName == targetState);
					stateSvc.ChangeState(card, branch);
				} else {
					var branch = stateSvc.FindLineBranchesByStartState(card.SystemInfo.State)
					.FirstOrDefault(s => s.EndState.DefaultName == "UnderApproval");
					stateSvc.ChangeState(card, branch);
					branch = stateSvc.FindLineBranchesByStartState(card.SystemInfo.State)
					.FirstOrDefault(s => s.EndState.DefaultName == "OnRegistration");
					stateSvc.ChangeState(card, branch);
					branch = stateSvc.FindLineBranchesByStartState(card.SystemInfo.State)
						.FirstOrDefault(s => s.EndState.DefaultName == targetState);
					stateSvc.ChangeState(card, branch);
				}
			}
		}
		public static void CreateMultipleBusinessTripRequests(UserSession session, ObjectContext context, int count = 100) {
			Console.WriteLine($"Session: {session.Id}");

			var businessTripKind = context.FindObject<KindsCardKind>(
				new QueryObject(KindsCardKind.NameProperty.Name, "Заявка на командировку"));

			if (businessTripKind == null) {
				Console.WriteLine("Вид карточки 'Заявка на командировку' не найден!");
				return;
			}
			var docSvc = context.GetService<IDocumentService>();
			var staffSvc = context.GetService<IStaffService>();
			var partnerSvc = context.GetService<IPartnersService>();
			var baseUnService = context.GetService<IBaseUniversalService>();
			var cityNode = baseUnService.FindItemTypeWithSameName("Города", null);

			Console.WriteLine($"Создание {count} тестовых заявок на командировку...");

			for (int i = 0; i < count; i++) {
				Console.WriteLine($"Создание карточки {i + 1}/{count}...");

				var businessTripRequest = docSvc.CreateDocument(null, businessTripKind);

				var author = staffSvc.FindEmpoyeeByAccountName(TestData.GetRandomEmployeeAccountNames());
				businessTripRequest.MainInfo.Author = author;
				businessTripRequest.MainInfo[CardDocument.MainInfo.RegDate] = DateTime.Now;
				string cardName = TestData.GetRandomCardsName();
				businessTripRequest.MainInfo.Name = cardName;
				businessTripRequest.Description = cardName;

				var sectionRows = (IList<BaseCardSectionRow>)businessTripRequest.GetSection(CardDocument.MainInfo.ID);
				var newRow = new BaseCardSectionRow();

				newRow["Registrar"] = author.GetObjectId();
				newRow["NumberDays"] = TestData.GetRandomDays();
				newRow["AmountTrips"] = TestData.GetRandomAmount();
				newRow["ReasonTrip"] = TestData.GetRandomReason();
				newRow["Tickets"] = TestData.GetRandomTicket();

				newRow["WhoRegistration"] = staffSvc.FindEmpoyeeByAccountName(TestData.GetRandomEmployeeAccountNames())?.GetObjectId();
				newRow["Concordant"] = staffSvc.FindEmpoyeeByAccountName(TestData.GetRandomEmployeeAccountNames())?.GetObjectId();
				newRow["WhoCommander"] = staffSvc.FindEmpoyeeByAccountName(TestData.GetRandomEmployeeAccountNames())?.GetObjectId();
				newRow["Organization"] = partnerSvc.FindCompanyByNameOnServer(null, "TestAgent")?.GetObjectId();
				newRow["City"] = cityNode.Items[TestData.GetRandomCity()].GetObjectId();

				Guid whoCommanderId = (Guid)newRow["WhoCommander"];
				newRow["Director"] = staffSvc.GetEmployeeManager(staffSvc.Get(whoCommanderId)).GetObjectId();
				newRow["Telephone"] = staffSvc.Get(whoCommanderId).MobilePhone;
				sectionRows.Add(newRow);

				context.AcceptChanges();
				string filePath = "Домашнее задание 5.docx";
				docSvc.AddMainFile(businessTripRequest, filePath);
				context.AcceptChanges();

				string state = TestData.GetRandomStates();

				ChangeCardState(context, businessTripRequest, state);


				context.AcceptChanges();
				Console.WriteLine($"Создана заявка на командировку: {businessTripRequest.GetObjectId()}");
			}
		}
		public static void CreateBusinessTripRequest(UserSession session, ObjectContext context) {
			Console.WriteLine($"Session: {session.Id}");

			var businessTripKind = context.FindObject<KindsCardKind>(
				new QueryObject(KindsCardKind.NameProperty.Name, "Заявка на командировку"));

			if (businessTripKind == null) {
				Console.WriteLine("Вид карточки 'Заявка на командировку' не найден!");
				return;
			}

			var docSvc = context.GetService<IDocumentService>();
			var staffSvc = context.GetService<IStaffService>();
			var partnerSvc = context.GetService<IPartnersService>();
			var baseUnService = context.GetService<IBaseUniversalService>();

			var businessTripRequest = docSvc.CreateDocument(null, businessTripKind);

			businessTripRequest.MainInfo.Author = staffSvc.GetCurrentEmployee();
			businessTripRequest.MainInfo[CardDocument.MainInfo.RegDate] = DateTime.Now;
			string cardName = $"Созданая карточка из кода: {DateTime.Now.ToString()}";
			businessTripRequest.MainInfo.Name = cardName;
			businessTripRequest.Description = cardName; // для поиска в exploler

			var sectionRows = (IList<BaseCardSectionRow>)businessTripRequest.GetSection(CardDocument.MainInfo.ID);
			var newRow = new BaseCardSectionRow();
			newRow["NumberDays"] = 12;
			newRow["AmountTrips"] = 120000;
			newRow["ReasonTrip"] = "устал";
			newRow["Tickets"] = 1; // поезд
			newRow["Registrar"] = staffSvc.GetCurrentEmployee();
			newRow["WhoRegistration"] = staffSvc.FindEmpoyeeByAccountName("ENGINEER\\DVAdmin")?.GetObjectId();
			newRow["Concordant"] = staffSvc.FindEmpoyeeByAccountName("ENGINEER\\DVAdmin")?.GetObjectId();
			newRow["WhoCommander"] = staffSvc.FindEmpoyeeByAccountName("ENGINEER\\s.kolesnikova")?.GetObjectId();
			newRow["Organization"] = partnerSvc.FindCompanyByNameOnServer(null, "TestAgent")?.GetObjectId();
			newRow["City"] = baseUnService.FindItemTypeWithSameName("Города", null).Items[0].GetObjectId(); // москва

			Guid whoCommanderId = (Guid)newRow["WhoCommander"];
			newRow["Director"] = staffSvc.GetEmployeeManager(staffSvc.Get(whoCommanderId)).GetObjectId();
			newRow["Telephone"] = staffSvc.Get(whoCommanderId).MobilePhone;
			sectionRows.Add(newRow);

			context.AcceptChanges();
			string filePath = "Домашнее задание 5.docx";
			docSvc.AddMainFile(businessTripRequest, filePath);
			context.AcceptChanges();

			ChangeCardState(context, businessTripRequest, "UnderApproval");
			context.AcceptChanges();

			Console.WriteLine($"Создана заявка на командировку: {businessTripRequest.GetObjectId()}");
		}
	}
}
