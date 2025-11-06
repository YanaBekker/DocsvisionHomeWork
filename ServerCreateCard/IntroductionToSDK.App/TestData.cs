
namespace IntroductionToSDK.App {
	public static class TestData {

		private static readonly Random random = new Random();

		public static readonly string[] EmployeeAccountNames = {
			"ENGINEER\\DVAdmin",
			"ENGINEER\\admin",
			"ENGINEER\\v.kuznesov",
			"ENGINEER\\k.semenov",
			"ENGINEER\\s.kolesnikova",
			"ENGINEER\\a.ivanov",
			"ENGINEER\\s.mihailov",
			"ENGINEER\\i.lebedev",
			"ENGINEER\\s.petrova",
			"ENGINEER\\p.samoilov"
		};

		public static readonly string[] CardsName = {
			$"Заявка на командировку: {DateTime.Now.ToString()}",
			$"Срочно!!: {DateTime.Now.ToString()}",
			$"testdoc: {DateTime.Now.ToString()}",
			$"DOCSVISION PROJECT ULTRA: {DateTime.Now.ToString()}",
			$"Дорогой дневник..: {DateTime.Now.ToString()}",
		};

		public static readonly string[] TripReasons = {
			"Участие в конференции",
			"Переговоры с клиентом",
			"Обучение сотрудников",
			"Техническая поддержка",
			"Презентация продукта",
			"Совещание с партнерами",
			"Аудит филиала",
			"Установка оборудования",
			"Сбор требований",
			"Подписание договора",
			"Просто устал"
		};

		public static readonly string[] Cities = { "Москва", "Новосибирск", "Санкт-Петербург" };

		public static readonly string[] Tickets = { "Авиа", "Поезд"};

		public static readonly string[] States = { "Project", "UnderApproval", "OnRegistration", "Close" };

		public static int GetRandomDays() {
			return random.Next(1, 31);
		}
		public static decimal GetRandomAmount() {
			return random.Next(50, 500) * 100;
		}
		public static string GetRandomReason() {
			return TripReasons[random.Next(TripReasons.Length)];
		}
		public static string GetRandomEmployeeAccountNames() {
			return EmployeeAccountNames[random.Next(EmployeeAccountNames.Length)];
		}
		public static string GetRandomCardsName() {
			return CardsName[random.Next(CardsName.Length)];
		}
		public static string GetRandomStates() {
			return States[random.Next(States.Length)];
		}
		public static int GetRandomCity() {
			return random.Next(Cities.Length);
		}
		public static int GetRandomTicket() {
			return random.Next(Tickets.Length);
		}
	}
}
