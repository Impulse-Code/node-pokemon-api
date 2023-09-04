import express from 'express';
import {Pokemon,validatePokemon } from "../models/Pokemon.js";
import auth from "../middleware/auth.js";
const router = express.Router();

// GET ALL POKEMONS
router.get('/',auth,async (req,res)=>{
    try{
        const pokemons = await Pokemon.find();
        console.log(pokemons)
        !pokemons && res.status(404).send('No Pokemons were found in the Database');
        res.status(200).json(pokemons);
    }
    catch(error){
        res.status(500).json(error.message)
    };


})


// GET SINGLE POKEMON
router.get('/:id',auth, async(req,res) => {
    try{
        const pokemon = await Pokemon.findById(req.params.id);
        if(!pokemon) return res.status(404).json('Sorry the Specified user could not be found');

        res.status(200).json(pokemon);
    }
    catch(error){
        return res.status(400).json(error.details[0].message) 
    }

});

// CREATE A POKEMON
router.post('/',auth, async (req,res) => {
    const {error} = validatePokemon(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let pokemon = await Pokemon.findOne({name:req.body.name})
    if(pokemon) return res.status(400).send('Pokemon already registered in the database')

    pokemon = new Pokemon({
        name:req.body.name,
        // owner:req.body.owner,
        powers:req.body.powers,
        category:req.body.category,
        desc:req.body.desc
    })

    await pokemon.save()
    res.status(200).json(pokemon)

});

// UPDATE A POKEMON
router.put('/:id',auth, async(req,res) => {
    try{
        const pokemon = await Pokemon.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
        res.status(200).json(`Pokemon info has been updated : `,pokemon);
    }
    catch(err){
        res.status(500).json(err);
    }

})

// DELETE A POKEMON
router.delete('/:id',auth, async(req,res) =>{
    try{
        const pokemon = await Pokemon.findByIdAndDelete(req.params.id);
        !pokemon && res.status(404).json(`Specified Pokemon not found`)
        
        res.status(200).json(`pokemon ${pokemon.name} has been deleted`)
    }
    catch(err){
        return res.status(500).json(err);
    }

});

export default router;