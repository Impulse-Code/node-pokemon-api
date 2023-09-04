import mongoose from "mongoose";
import joi from "joi";

const pokemonSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },

    // owner:{
    //   type:mongoose.Types.ObjectId,
    //   ref:'User',
    //   required:true,
    // },

    powers:{
        type:Array,
        default:null,
    },
    desc:{
        type:String,
        required:true,
    },
    category:{
        type:[String],
        enum:['Earth','Fire','Water','Air','Spirit'],
        required:true,
    }
});

const  Pokemon = mongoose.model('Pokemon',pokemonSchema);



function validatePokemon(pokemon){
    const schema=joi.object({
        name:joi.string().min(2).max(50).required(),
        // owner:joi.string().min(2).max(50).required(),s
        powers:joi.string().min(5).max(50).required(),
        desc:joi.string().min(5).max(500).required(),
        category:joi.string().min(3).max(50).required(),
    });
    return schema.validate(pokemon);
}

export{
    validatePokemon,
    Pokemon
}
// module.exports.Pokemon = Pokemon;
// module.exports.validatePokemon = validatePokemon;
