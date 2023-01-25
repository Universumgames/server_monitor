export interface CreateDeviceRegistrationResponse {
    token: string
    expires: Date
}

export interface CheckDeviceRegistrationResponse extends CreateDeviceRegistrationResponse {
    deviceId: string
}
