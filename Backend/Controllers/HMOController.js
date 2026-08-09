import Hmo from "../model/Statutory.js"

const createHmo = async (req, res) => {
   try{
     const {amount, name} = req.body
     const hmo = new Hmo({
        amount,
        name
     })
     await hmo.save()
     res.status(201).json({success: true, message:"New HMO is created", hmo})
   } catch(error) {
        res.status(500).json({success:false, error: "add edit server error"})
   }
}

const editHmo = async (req, res) => {
    try {
    const {id} = req.params
    const {amount, name} = req.body
    const editedHmo = await Hmo.findByIdAndUpdate(id, {amount, name}, { new: true, runValidators: true })
    res.status(200).json({success: true, message:"New HMO is created", editedHmo})
    } catch (error) {
        console.error("Error updating hmo:", error);
        res.status(500).json({success:false, error: "update department server error"})
    }
}

 const getHmo = async (req, res) => {
    try {
        const HMO = await Hmo.find()
         res.status(200).json({success: true, message:"Hmo fetch successful", HMO})
    } catch (error) {
        console.error("Error getting Hmo:", error);
        res.status(500).json({success:false, error: "update department server error"})
    }
 }
 const getHmoSingular = async (req, res) => {
    const {id} = req.params
    try {
        const hmo = await Hmo.findById(id)
         res.status(200).json({success: true, message:"Hmo fetch successful", hmo})
    } catch (error) {
        console.error("Error getting Hmo:", error);
        res.status(500).json({success:false, error: "update department server error"})
    }
 }

export {editHmo, createHmo, getHmo, getHmoSingular}