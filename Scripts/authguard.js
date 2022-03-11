"use strict";
((function () {
    let protected_routes = [
        "contact-list"
    ];
    console.log(protected_routes.indexOf(router.ActiveLink));
    if (protected_routes.indexOf(router.ActiveLink) > -1) {
        if (!sessionStorage.getItem("user")) {
            location.href = "/login";
        }
    }
}))();
//# sourceMappingURL=authguard.js.map