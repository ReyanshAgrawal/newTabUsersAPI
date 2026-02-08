const mongoose = require("mongoose")

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter the name for this user..."]
        },

        pass: {
            type: String,
            required: [true, "Please enter the password for this user..."]
        },

        searchEngine: {
            type: Number,
            required: [true, "Please enter the search engine number for this user. 1 - Bing, 2 - Google, 3 - Ecosia"]
        },

        shortcuts: {
            type: Array,
            required: false
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("User", UserSchema)
module.exports = User;