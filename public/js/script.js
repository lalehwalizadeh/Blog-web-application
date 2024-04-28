document.getElementById('delete').addEventListener('click',async()=>{
    const id = req.params.id;
   const response = await fetch('http://localhost:3000/posts/${id}',
{method : 'DELETE'});
if(response.ok){
   alert('Post deleted successfully');
}else{
   alert('Failed to delete post')
}
})

const deletePost = (item) => {
   const index = posts.indexOf(item);
   if (index !== -1) {
       posts.splice(index, 1);
   }
}
// display Images:
  
      
    