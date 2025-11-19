using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

public class ApiResponse
{
    public bool Success { get; set; }
    public List<FlightData> Data { get; set; }
}

public class FlightData
{
    public int Price { get; set; }
    public string Airline { get; set; }

    [JsonPropertyName("flight_number")]
    public string Flight_Number { get; set; }

}