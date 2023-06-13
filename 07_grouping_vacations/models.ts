export interface IUserResponse {
    _id: string
    user: IUser
    usedDays: number
    endDate: string
    startDate: string
    status?: string
}

export interface IUser {
    name: string
    _id: string
}

export interface ITransformUser {
    userId: string
    userName: string
    vacations: IVacation[]
}

export interface IVacation {
    startDate?: string
    endDate?: string
}
