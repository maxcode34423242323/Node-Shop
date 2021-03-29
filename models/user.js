const {Schema, model} = require('mongoose')

const user = new Schema({
    email: {
        type: String,
        required: true
    },
    name: String,
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true,
                }
            }
        ]
    }
})
user.methods.addToCart =  function (course){
    const cloneItems = [...this.cart.items]
    const idx = cloneItems.findIndex( c => {
        return c.courseId.toString() === course._id.toString()
    })
    if(idx >= 0){
        cloneItems[idx].count = cloneItems[idx].count + 1
    } else {
        cloneItems.push({
            courseId: course._id,
            count: 1
        })
    }
    const newCart = {items: cloneItems}
    this.cart = newCart
    return this.save()
}
user.methods.removeFromCart = function(id){
    let items = [...this.cart.items]
    
    const idx = items.findIndex( c => {
        return c.courseId.toString() === id.toString()
    })
    if(items[idx].count === 1) {
        items = items.filter( c => c.courseId.toString() !== id.toString() )
    } else {
        items[idx].count--
    }
    this.cart = {items}
    return this.save()
}

user.methods.clearCart = function(){
    this.cart = {items: []}
    return this.save()
}


module.exports = model('User', user)