

export const deletePost = async (postId) => {
    const response = await fetch(`https://pralap-f9hz.onrender.com/blogs/blog/${postId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response
    
}