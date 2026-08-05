async function LoadReview()
{
    const { data, error } = await supabase_var
    .from("review")
    .select("*")
    .order("createdat", { ascending: false });

    if (error) {
        console.log(error);
        alert("Something went wrong.");
        return;
    }

    const reviewCarousel = document.getElementById("reviewCarousel");

    reviewCarousel.innerHTML = "";

    data.forEach(blog => {
        let star = "";
        let review_link = (blog.review_link) ? '<a href="' + blog.review_link + '" blank="_target" class="small gold-text text-decoration-none mt-3 tracking-wider uppercase font-monospace">Google review →</a>' : '<a></a>';
        if(blog.star_count == 5) { star = "★★★★★"; } else if(blog.star_count == 4) { star = "★★★★"; } else if(blog.star_count == 3) { star = "★★★"; } else if(blog.star_count == 2) { star = "★★"; } else  { star = "★"; } 
        const card = '<article class="glass-panel border-3">' +
                    '<button  class="delete-blog-btn" onclick="openDeleteReview(\'' + blog.id + '\')"><i class="fa-solid fa-trash"></i></button>' +
                  '<span class="stars">' + star  + '</span>' +
                  '<h3>' + blog.name + '</h3>' +
                  '<p>' + blog.body + '</p>' +
                  review_link +
                '</article>';

        reviewCarousel.insertAdjacentHTML("beforeend", card);

    });
}

async function deleteReview()
{
    let user_id = document.getElementById("bg-delete-review-userid").value;
    if(user_id != "GMJ111"){ alert("Invalid user id. You are not authorized."); return; }
    let id = document.getElementById("bg-delete-review-id").value;
    if(id)
    {
        // Delete database record
        const { error: deleteError } = await supabase_var
            .from("review")
            .delete()
            .eq("id", id);

        if (deleteError) {
            console.error(deleteError);
            alert("Unable to delete review.");
            return;
        }


        document
              .getElementById("jgalsDeleteReview")
              .classList.remove("show");

        alert("Review deleted successfully.");

        LoadReview();      // Refresh review list

    }
}

async function AddReview()
{
    let user_id = document.getElementById("review_userid").value;
    //let blogStatus = document.getElementById("blogStatus").value;
    //let bg_dt = document.getElementById("blogDate").value;
    //let blog_dt = new Date(bg_dt);
    let rating = document.getElementById("reviewRating").value;
    let name = document.getElementById("reviewName").value;
    let body = document.getElementById("reviewBody").value;
    let review_link = document.getElementById("reviewLink").value;

    if(user_id != "GMJ111"){ alert("Invalid user id. You are not authorized."); return; }
    if (
    !rating ||
    !name.trim() ||
    !body.trim()
    ){ alert("Rating, name and body are mandatory."); return; }


    const { data, error } = await supabase_var
    .from("review")
    .insert([
    {
        star_count:rating,

        name:name,

        body:body,

        review_link:review_link,

        status: "active"
    }
    ]).select()
    .single();

    if (error) {
        console.log(error);
        alert("Something went wrong.");
        return;
    }

   
    
    alert("Review added successfully.");
    location.reload();
}
