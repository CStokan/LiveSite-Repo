"use strict";
((function()
{
    
    let protected_routes: string[] = [
        "contact-list"
    ]


    console.log(protected_routes.indexOf(router.ActiveLink));

    if(protected_routes.indexOf(router.ActiveLink) > -1)
    {
        // Check if user is logged in - if not redirect
        if(!sessionStorage.getItem("user"))
        {
            location.href = "/login";
            
        }
    }



}))();