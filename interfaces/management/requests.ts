export interface UserEditRequest {
    userId: string
    delete?: boolean
    newUsername?: string
    newEmail?: string
}
