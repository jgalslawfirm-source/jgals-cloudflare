function timeAgo(dateString)
{

            const date = new Date(dateString);
            const now = new Date();

            const diff = Math.floor((now - date) / 1000);

            if(diff < 60)
                return "Just now";

            if(diff < 3600)
                return Math.floor(diff/60) + " minutes ago";

            if(diff < 86400)
                return Math.floor(diff/3600) + " hours ago";

            if(diff < 172800)
                return "Yesterday";

            if(diff < 2592000)
                return Math.floor(diff/86400) + " days ago";

            if(diff < 31536000)
                return Math.floor(diff/2592000) + " months ago";

            return Math.floor(diff/31536000) + " years ago";
}

async function LoadBlog()
{
    const { data, error } = await supabase_var
    .from("blogs")
    .select("*")
    .order("blogdate", { ascending: false });

    if (error) {
        console.log(error);
        alert("Something went wrong.");
        return;
    }

    const blogCarousel = document.getElementById("blogCarousel");

    blogCarousel.innerHTML = "";

    data.forEach(blog => {
        let image_url  = "";
        if(blog.image == "")
        {
            image_url = "assets/blog-placeholder-2.png"
        }
        else
        {
            image_url = blog.image;
        }

        // onclick="ReadBlog('${blog.blogdate}','${image_url}','${blog.title}','${blog.body}')"
        const card = `
            <div class="blog-card-wrapper">

                <button class="delete-blog-btn"
                        onclick="openDeleteBlog('${blog.id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>

                <a class="blog-card" href="blogs/ReadBlog.html?id=${blog.id}">

                    <article>

                        <img src="${image_url}"
                             alt="${blog.title}">

                        <time datetime="${blog.blogdate}">
                            ${timeAgo(blog.blogdate)}
                        </time>

                        <h3>${blog.title}</h3>

                        <p>${blog.body.substring(0,100)}... <u style="color:dodgerblue">click to read more</u></p>

                    </article>

                </a>

            </div>
        `;

        blogCarousel.insertAdjacentHTML("beforeend", card);

    });
}

async function deleteBlog()
{
    let user_id = document.getElementById("bg-delete-userid").value;
    if(user_id != "GMJ111"){ alert("Invalid user id. You are not authorized."); return; }
    let blog_id = document.getElementById("bg-delete-id").value;
    if(blog_id)
    {
        // Get blog details
        const { data: blog, error: fetchError } = await supabase_var
            .from("blogs")
            .select("image")
            .eq("id", blog_id)
            .single();

        if (fetchError) {
            console.error(fetchError);
            alert("Unable to find blog.");
            return;
        }

        // Delete image from Storage
        if (blog.image) {

            // Extract filename from public URL
            const fileName = blog.image.split("/").pop();

            const { error: storageError } = await supabase_var
                .storage
                .from("blogs")
                .remove([fileName]);

            if (storageError) {
                console.error(storageError);
                // Continue deleting database record even if image deletion fails
            }
        }

        // Delete database record
        const { error: deleteError } = await supabase_var
            .from("blogs")
            .delete()
            .eq("id", blog_id);

        if (deleteError) {
            console.error(deleteError);
            alert("Unable to delete blog.");
            return;
        }


        document
              .getElementById("jgalsDeleteBlog")
              .classList.remove("show");

        alert("Blog deleted successfully.");

        LoadBlog();      // Refresh blog list

    }
}

async function AddBlog()
{
    let user_id = document.getElementById("userid").value;
    //let blogStatus = document.getElementById("blogStatus").value;
    let bg_dt = document.getElementById("blogDate").value;
    let blog_dt = new Date(bg_dt);
    let title = document.getElementById("blogTitle").value;
    let body = document.getElementById("blogBody").value;
    let str = document.getElementById("blogImage").files[0];
    let file = document.getElementById("blogImage").files[0];
    let str_bg_dt = blog_dt.getFullYear() + "-" + (blog_dt.getMonth() + 1) + "-" + blog_dt.getDate() + " " + blog_dt.getHours() + ":" + blog_dt.getMinutes();

    if(user_id != "GMJ111"){ alert("Invalid user id. You are not authorized."); return; }
    //if(bg_dt == "") { str_bg_dt = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(); }
    //if(str == "undefined") { alert("Image not uploaded. Upload to proceed."); return; }

    const { data, error } = await supabase_var
    .from("blogs")
    .insert([
    {
        title:title,

        body:body,

        image:"",

        status: "active",
        
        blogdate: str_bg_dt,

        createdat: year + "-" + month + "-" + day
    }
    ]).select()
    .single();

    if (error) {
        console.log(error);
        alert("Something went wrong.");
        return;
    }

    if(str != undefined)
    {
        // Upload Image Using UUID
        const blogId = data.id;
        const extension = file.name.split('.').pop();
        const fileName = `${blogId}.${extension}`;

        const { error: uploadError } = await supabase_var.storage
            .from("blogs")
            .upload(fileName, file);

        if (uploadError) {
            console.log(uploadError);
            alert("Something went wrong.");
            return;
        }

        // Get Public URL
        const {
            data: { publicUrl }
        } = supabase_var.storage
            .from("blogs")
            .getPublicUrl(fileName);

        // Update the Blog Record
        const { error: updateError } = await supabase_var
        .from("blogs")
        .update({
                image: publicUrl
            })
            .eq("id", blogId);

        if (updateError) {
            console.log(updateError);
            alert("Something went wrong.");
            return;
        }

    }
    
    alert("Blog added successfully.");
    location.reload();
}
