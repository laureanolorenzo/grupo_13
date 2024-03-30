async function checkField(value,db,field){
    const entryExists = await db.Peliculas.findOne(
        {
            where: {[field]:value}
        }
    );
    if (entryExists !== null) { 
        throw new Error('El título ya existe en la base de datos')
    }
}
// async function checkDuplicateMovieFiles(poster,banner,db){
//     const bannerExists = await db.findOne(
//         {where: {'banner':banner}}
//     );
//     const posterExists = await db.findOne(
//         {where: {'poster':poster}}
//     );
//     if (bannerExists) {
//         return {{"type":"field","msg":"Por favor seleccione si su película se estrena o no.","path":"estreno","location":"body"}}
//     }
// }
module.exports = checkField;