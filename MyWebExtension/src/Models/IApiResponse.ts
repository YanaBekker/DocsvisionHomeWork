export interface ApiResponse {
    success: boolean;
    data: FlightData[];
}

export interface FlightData {
    price: string;
    airline: string;
    flight_Number: string;
}