export interface Vehicle {
    id: number;
    plate: string;
    client: string;
    phone: string;
    createAt: string;
    typeVehicle: {
        id: number;
        type: string;
    };
}

export interface VehicleSelected {
    id: number;
    plate: string;
    client: string;
    phone: string;
    typeVehicleId: number;
}