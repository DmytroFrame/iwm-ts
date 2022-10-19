

export default class Player {
    readonly username: string
    readonly uuid: string
    readonly id: number

    constructor (username: string) {
        this.username = username
        this.uuid = crypto.randomUUID()
        this.id = Math.ceil(Math.random() * 10000)
    }
}