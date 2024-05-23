const Review = require('./../models/reviewModel');
const reviewValidator = require('./../validation/ReviewValidator')


exports.CreateReview = async (req,res)=>{
  try{
    const {error,value} = reviewValidator.newReview({
        comment: req.body.comment,
        user:req.user._id,
        product:req.params.id

    })
    console.log(error)
     if(error){
        res.status(400).json({
            status:'fail',
            message:"please enter valid data",
        })

      return;
     }
    
     const newReview = await Review.create(value);
     res.status(201).json({
         status:'success',
         data:{
             newReview
         }
     });

    }catch(err){
         
        res.status(400).json({
            status:'fail',
            message:err
        })

    }

}


exports.CreateRating = async (req,res)=>{

 try{
    const {error,value} = reviewValidator.newRating({
        rating: req.body.rating,
        user:req.user._id,
        product:req.params.id,

    })
     if(error){
        res.status(400).json({
            status:'fail',
            message:"please enter valid data",
        })

      return;
     }
    
     const newRating = await Review.create(value);
     res.status(201).json({
         status:'success',
         data:{
             newRating
         }
   })

}catch(err){
    res.status(400).json({
        status:'fail',
        message:err
    })
}

}

exports.getReviews = async(req,res)=>{
       try{
        const reviews =  await Review.find({product:req.params.id});
        res.status(200).json({
            status:'success',
            data:{
                reviews
            }
        })
       }catch(err){
        res.status(400).json({
            status:'fail',
            message:err
        })
       }
}