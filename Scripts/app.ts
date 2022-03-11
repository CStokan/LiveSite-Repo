// IIFE -- Immediately Invoked Function Expression
// AKA -- Anonymous Self-Executing Function
(function()
{

    function AuthGuard(): void
    {
        let protected_routes: string[] = [
            "contact-list"
        ];
    
        if(protected_routes.indexOf(router.ActiveLink) > -1)
        {
            // Check if user is logged in - if not change the active link
            if(!sessionStorage.getItem("user"))
            {
                router.ActiveLink = "login";
                
            }
        }
    
    }

    function LoadLink(link: string, data: string = ""): void
    {
        router.ActiveLink = link;

        AuthGuard();

        router.LinkData = data;

        history.pushState({}, "", router.ActiveLink);

        // Capitalize the active link and set document title to it
        document.title = router.ActiveLink.substring(0,1).toUpperCase() + router.ActiveLink.substring(1);


        // Remove all active Nav Links
        $("ul>li>a").each(function()
        {
            $(this).removeClass("active");
        });

        $(`li>a:contains(${document.title})`).addClass("active"); // Updates the active link in the navbar

        CheckLogin();
        LoadContent();

    }

    function AddNavigationEvents(): void
    {

        // All anchor tags inside ul li - Nav Links
        let NavLinks = $("ul>li>a");

        NavLinks.off("click");
        NavLinks.off("mouseover");

        // Loop through each navigation link and load appropriate content on click
        NavLinks.on("click", function()
        {
            LoadLink($(this).attr("data") as string);

        });
        
        // change cursor to hand
        NavLinks.on("mouseover", function()
        {
            $(this).css("cursor", "pointer");
        });

    }

    function AddLinkEvents(link: string): void
    {
        // all links
        let linkQuery = $(`a.link[data=${link}]`);

        // Remove all link events
        linkQuery.off("click");
        linkQuery.off("mouseover");
        linkQuery.off("mouseout");

        // css adjustment for links
        linkQuery.css("text-decorartion", "underline");
        linkQuery.css("color", "blue");

        // add link events
        linkQuery.on("click", function()
        {
            LoadLink(`${link}`);
        });

        linkQuery.on("mouseover", function()
        {
            $(this).css('cursor', 'pointer');
            $(this).css('font-weight', 'bold');
        });


        linkQuery.on("mouseout", function()
        {
            $(this).css('font-weight', 'normal');
        });

    }

    /**
     * This function uses AJAX to open a connection to the server and returns
     * the data payload to the callback function
     *
     * @param {string} method
     * @param {string} url
     * @param {Function} callback
     * 
     * @returns {void}
     */
    function AjaxRequest(method: string, url: string, callback: Function): void
    {
        // AJAX STEPS for and AJAX request
        // Step 1 - instantiate an XHR object
        let XHR = new XMLHttpRequest();

        // Step 2 - Add an event listener for ready state
        XHR.addEventListener("readystatechange", () =>
        {
            if(XHR.readyState === 4 && XHR.status === 200)
            {
                if(typeof callback === "function")
                {
                    callback(XHR.responseText);
                }
                else
                {
                    console.error("ERROR: callback not a function")
                }
            }
        });

        // Step 3 - Open a connection to the server
        XHR.open(method, url);

        // Step 4 - Send the request to the server
        XHR.send();

    }

    /**
     * This function loads the header.html content into the page
     *
     * @returns {void}
     */
    function LoadHeader(): void
    {
        // Use AJAX to lead the header content
        $.get("./views/components/header.html", function(html_data)
        {
            // Inject navbar into the header
            $("header").html(html_data);

            AddNavigationEvents();

            // Check if user is logged in
            CheckLogin();
        });
    }


    /**
     * 
     * 
     * @return {void}
     */
    function LoadContent(): void
    {
        // Alias for active link
        let pageName = router.ActiveLink;
        let callback = ActiveLinkCallBack();

        $.get(`./views/content/${pageName}.html`, function(html_data)
        {
            $("main").html(html_data);
            callback();
        });

    }
    
    /**
     *
     *@returns {void}
     */
    function LoadFooter(): void
    {

        $.get(`./views/components/footer.html`, function(html_data)
        {
            $("footer").html(html_data);
        });
    }

    function DisplayHomePage(): void
    {
        console.log("Home Page");

        // 1) Fattest Memory Footprint
        // Trying to create the about us button above with jQuery
        // jQuery way - get all elements with an id of AboutUsButton and for each element add a "click" event
        $("#AboutUsButton").on("click", function()
        {
            LoadLink("about");
        });

        // jQuery editing
        $("main").append(`<p id="MainParagraph" class="mt-3">This is the Main Paragraph</p>`);
        $("main").append(`<article>
        <p id="ArticleParagraph" class="mt-3">This is the Article Paragraph</p>
        </article>`);



    }
    
    function DisplayProductsPage(): void
    {
        console.log("Products Page");
    }

    function DisplayServicesPage(): void
    {
        console.log("Services Page");
    }

    function DisplayAboutPage(): void
    {
        console.log("About Page");
    }


    /**
     * This function adds a Contact object to localStorage
     * 
     * @param {string} fullName 
     * @param {string} contactNumber 
     * @param {string} emailAddress 
     */
    function AddContact(fullName: string, contactNumber: string, emailAddress: string)
    {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if(contact.serialize())
        {
            let key = contact.FullName.substring(0, 1) + Date.now();
            localStorage.setItem(key, contact.serialize() as string);
        }
    }

    /**
     * This function is used to validate the fields of the contact form
     * 
     * @param {string} fieldID
     * @param {RegExp} regular_expression
     * @param {string} error_message
     */
    function ValidateField(fieldID: string,regular_expression: RegExp, error_message: string)
    {
        // Hide the alert message for invalid data
        let messageArea = $("#messageArea").hide()
        
        // Field Id sent
        $("#" + fieldID).on("blur", function()
        {
            // Declare value of full name
            let text_value = $(this).val() as string;
            // tests if full name is valid
            if(!regular_expression.test(text_value))
            {
                $(this).trigger("focus").trigger("select");
                // Set alert box to danger mode
                messageArea.addClass("alert alert-danger").text(error_message).show();
            }
            else
            {
                // Does pass tast - resets the alert box
                messageArea.removeAttr("class").hide();
            }
        });
    }

    function ContactFormValidation(): void
    {
        // Call the validation functions
        ValidateField("fullName", /^([A-Z][a-z]{1,3}.?\s)?([A-Z][a-z]{1,})((\s|,|-)([A-Z][a-z]{1,}))*(\s|,|-)([A-Z][a-z]{1,})$/, "Please enter a valid Full Name.\n This must include at least a Capitalized First Name and Last Name.");
        ValidateField("contactNumber", /^(\+\d{1,3}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, "Please enter a valid Contact Number. Example: (416) 555-5555");
        ValidateField("emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid Email Address.");
        
    }

    function DisplayContactPage(): void
    {
        console.log("Contact Page");

        $("a[data='contact-list']").off("click");

        $("a[data='contact-list']").on("click", function()
        {
            LoadLink("contact-list");
        });

        // Call validation function
        ContactFormValidation();

        let sendButton = document.getElementById("sendButton")as HTMLElement;
        let subscribeCheckbox = document.getElementById("subscribeCheckbox") as HTMLInputElement;

        //$("#showContact").hide();

        sendButton.addEventListener("click", function(event)
        {
            // Declare these properties
            let fullName = document.forms[0].fullName.value;
            let contactNumber = document.forms[0].contactNumber.value;
            let emailAddress = document.forms[0].emailAddress.value;

            // event.preventDefault(); // right now for testing only
            if(subscribeCheckbox.checked)
            {
                let contact = new core.Contact(fullName, contactNumber, emailAddress);
                if(contact.serialize())
                {
                    let key = contact.FullName.substring(0, 1) + Date.now();
                    localStorage.setItem(key, contact.serialize()as string);
                }
            }
        });
    }

    function DisplayContactListPage(): void
    {
        if(localStorage.length > 0)
        {
            let contactList = document.getElementById("contactList") as HTMLElement;

            let data = "";

            let keys = Object.keys(localStorage); // Returns a list of keys from local storage

            let index = 1;

            // for every key in the keys string array
            for(const key of keys)
            {
                let contactData = localStorage.getItem(key) as string; // get localStorage data value 
               
                let contact = new core.Contact(); // Creates an empty contact
                contact.deserialize(contactData)

                

                data += `<tr>
                <th scope="row" class="text-center">${index}</th>
                <td>${contact.FullName}</td>
                <td>${contact.ContactNumber}</td>
                <td>${contact.EmailAddress}</td>
                <td class="text-center"><button value="${key}" class="btn btn-primary sm edit"><i class="fas fa-edit fa-sm"></i> Edit</button></td>
                <td class="text-center"><button value="${key}" class="btn btn-danger sm delete"><i class="fas fa-trash-alt fa-sm"></i> Delete</button></td>
                </tr>`;

                index++;
            }

            contactList.innerHTML = data;

            $("button.delete").on("click", function()
            {
                // confirm is a yes no alert/message box
                if(confirm("Are you sure?"))
                {
                    // The value is the value up in the button aka key
                    localStorage.removeItem($(this).val() as string)
                }
                // refresh the contact list page
                LoadLink("contact-list");
            });

            $("button.edit").on("click", function()
            {
                // adds the this.val to the hash 
                LoadLink("edit", $(this).val() as string);
            })
        }

        // Add contact button on click to take us to edit.html
        $("#addButton").on("click", ()=>
        {
            LoadLink("edit", "add");
        });
    }

    function DisplayEditPage(): void
    {
        console.log("Edit Page");

        // Call validation
        ContactFormValidation();

        // Start the page after the hashtag
        let page = router.LinkData;

        switch(page)
        {
            case "add":
                {
                    // Change H1 from edit to add
                    $("main>h1").text("Add Contact");
                    // Change edit button to add 
                    $("#editButton").html(`<i class="fas fa-plus-circle fa-lg"></i> Add`);

                    $("#editButton").on("click", (event) =>
                    {
                        // Prevent default to stop the form from working
                        event.preventDefault();

                        // Declare these properties
                        let fullName = document.forms[0].fullName.value;
                        let contactNumber = document.forms[0].contactNumber.value;
                        let emailAddress = document.forms[0].emailAddress.value;

                        
                        AddContact(fullName, contactNumber, emailAddress);
                        LoadLink("contact-list");
                    });

                    $("#cancelButton").on("click", () =>
                    {
                        LoadLink("contact-list");
                    });

                }
                break;
            default:
                {
                    // Gets contact information from local storage
                    let contact = new core.Contact();

                    // Get the contact from the page/key
                    contact.deserialize(localStorage.getItem(page) as string);

                    // display the contact in the edit form
                    $("#fullName").val(contact.FullName);
                    $("#contactNumber").val(contact.ContactNumber);
                    $("#emailAddress").val(contact.EmailAddress);

                    // Page is the key
                    $("#editButton").on("click", (event) =>
                    {
                        event.preventDefault();

                        // get changes from the page
                        contact.FullName = $("#fullName").val() as string;
                        contact.ContactNumber = $("#contactNumber").val() as string;
                        contact.EmailAddress = $("#emailAddress").val() as string;
    
                        // Prevent default to stop the form from normal behaviour
                        localStorage.setItem(page, contact.serialize() as string);
                        LoadLink("contact-list");
                    });
                    
                    $("#cancelButton").on("click", () =>
                    {
                        LoadLink("contact-list");
                    });
                    
                }
                break;
        }
        
    }

    function CheckLogin(): void
    {
        // if user is logged in
        if(sessionStorage.getItem("user"))
        {
            // swap out the login link for logout
            $("#login").html(
                `<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>`
            ); 

            $("#showContact").show();

            // logout if logged in
            $("#logout").on("click", function()
            {
                // perform logout
                sessionStorage.clear();

                 // swap out the login link for logout
                $("#login").html(
                    `<a class="nav-link" data="login"><i class="fas fa-sign-in-alt"></i> Login</a>`
                ); 
                
                AddNavigationEvents();

                // Load login
                LoadLink("login");

            });
        }
    }

    // Displays user login page
    function DisplayLoginPage(): void
    {
        console.log("Login Page");
        let messageArea =  $("#messageArea");
        messageArea.hide();

        AddLinkEvents("register");

        $("#loginButton").on("click", function()
        {
            let success = false;
            // create an empty user object
            let newUser = new core.User();

            // uses jQuery shortcut to load the users.json file
            $.get("./Data/users.json", function(data)
            {
                // for every user in the users.json file
                for (const user of data.users) 
                {
                    // Declare these properties
                    let username = document.forms[0].username.value;
                    let password = document.forms[0].password.value;

                    // check if the username and password entered in the form matches this user
                    if(username == user.Username && password == user.Password)
                    {
                        // get the user data from the file and assign to our empty user object
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }

                 // if username and password matches - success.. the perform the login sequence
                if(success)
                {
                    // add user to session storage
                    sessionStorage.setItem("user", newUser.serialize() as string);

                    // hide any error message
                    messageArea.removeAttr("class").hide();

                    // redirect the user to the secure area of our site - contact-list.html
                    LoadLink("contact-list");
                }
                // else if bad credentials were entered...
                else
                {
                    // display an error message
                    $("#username").trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text("Error: Invalid Login Information").show();
                    console.log(messageArea);
                }
            });
        });

        $("#cancelButton").on("click", function()
        {
            // clear the login form
            document.forms[0].reset();

            // return to the home page
            LoadLink("home");
        });
    }


    function Display404Page(): void
    {

    }
    
    function DisplayRegisterPage(): void
    {
        console.log("Register Page");

        AddLinkEvents("login");
    }


    /**
     * This method returns the appropriate function callback
     * @returns {function}
     */
    function ActiveLinkCallBack(): Function
    {
        switch(router.ActiveLink)
        {
            case "home": return DisplayHomePage;
            case "about": return DisplayAboutPage;
            case "products": return DisplayProductsPage;
            case "services": return DisplayServicesPage;
            case "contact": return DisplayContactPage;
            case "contact-list": return DisplayContactListPage;
            case "edit": return DisplayEditPage;
            case "login": return DisplayLoginPage;
            case "register": return DisplayRegisterPage;
            case "404": return Display404Page;
            default:
                console.error("ERROR: callback does not exist: " + router.ActiveLink);
                return new Function();
        }
    }


    // Named function option
    /**
     * This is the entry point of the web application
     * 
     *
     */
    function Start(): void
    {
        console.log("Welcome to my App!");

        // Adds header to all files        
        LoadHeader();


        LoadLink("home");

        LoadFooter();
        
    }



    // Calls the function when the window loads using an event listener
    window.addEventListener("load", Start);
    
})();