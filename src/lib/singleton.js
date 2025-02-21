class Singleton{
    constructor(base, ...props) {
        this.base = base
        this.props = props
        this.instance = null
    }
    GetSingleton(){
        if(!this.instance){
            this.instance = new this.base(...this.props)
        }
        return this.instance
    }
}
export {Singleton}