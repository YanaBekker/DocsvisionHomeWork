using System;
using System.Net.Http;
using Newtonsoft.Json;
using DocsVision.Platform.WebClient.Diagnostics;

namespace MySE
{
    public class AviasalesApiClient
    {
        private readonly HttpClient _httpClient;
        private readonly string _token;

        public AviasalesApiClient(string token)
        {
            _httpClient = new HttpClient();
            _httpClient.Timeout = TimeSpan.FromSeconds(30);
            _token = token;
        }

        public ApiResponse GetCheapestFlights(
            string origin,
            string destination,
            string departureAt,
            string returnAt = null,
            string currency = "rub",
            bool oneWay = true,
            bool direct = false,
            string sorting = "price",
            int limit = 30,
            int page = 1,
            bool unique = false)
        {
            try
            {
                var url = $"https://api.travelpayouts.com/aviasales/v3/prices_for_dates" +
                          $"?origin={origin}" +
                          $"&destination={destination}" +
                          $"&departure_at={departureAt}" +
                          $"&currency={currency}" +
                          $"&one_way={oneWay.ToString().ToLower()}" +
                          $"&direct={direct.ToString().ToLower()}" +
                          $"&sorting={sorting}" +
                          $"&limit={limit}" +
                          $"&page={page}" +
                          $"&unique={unique.ToString().ToLower()}" +
                          $"&token={_token}";

                if (!string.IsNullOrEmpty(returnAt))
                {
                    url += $"&return_at={returnAt}";
                }

                Trace.TraceError($"\n\n\n\n API URL: {url}\n\n");

                var response = _httpClient.GetAsync(url).GetAwaiter().GetResult();

                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                    Trace.TraceError($"\n\n\n\n API Response JSON: {jsonResponse}\n\n");
                    var apiResponse = JsonConvert.DeserializeObject<ApiResponse>(jsonResponse);
                    return apiResponse;
                }
                else
                {
                    Trace.TraceError($"\n\n\n\n API Error: {response.StatusCode}\n\n");
                    return null;
                }
            }
            catch (Exception ex)
            {
                Trace.TraceError($"\n\n\n\n Request failed: {ex.Message}\n{ex.StackTrace}\n\n");
                return null;
            }
        }
    }
}