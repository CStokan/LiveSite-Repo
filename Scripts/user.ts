namespace core
{
    export class User
    {

        // Private instance members
        private m_displayName: string;
        private m_emailAddress: string;
        private m_username: string;
        private m_password: string;

        // getters and setters
        public get DisplayName(): string
        {
            return this.m_displayName;
        }
        public set DisplayName(name: string)
        {
            this.m_displayName = name;
        }

        public get EmailAddress(): string
        {
            return this.m_emailAddress;
        }

        public set EmailAddress(email_address: string)
        {
            this.m_emailAddress = email_address;
        }

        public get Username(): string
        {
            return this.m_username;
        }

        public set Username(username: string)
        {
            this.m_username = username;
        }

        public get Password(): string
        {
            return this.m_password;
        }

        public set Password(password: string)
        {
            this.m_password = password;
        }

        // Constructor
        constructor(displayName: string = "", emailAddres: string = "", userName: string = "", password: string = "")
        {
            this.m_displayName = displayName;
            this.m_emailAddress = emailAddres;
            this.m_username = userName;
            this.m_password = password;
        }


        // method overrides
        /**
         * Override toString method and returns a comma separated string of the object
         *
         * @override
         * @return {string}  
         */
        toString(): string
        {
            return `Display Name    : ${this.DisplayName}\nEmail Address : ${this.EmailAddress} \nUsername : ${this.Username}`;
        }

        // Utiility methods

        // Returns a JSON object
        // TODO: need to fix the return type
        /**
         *
         *
         * @return {{ DisplayName: string, EmailAddress: string, Username: string}}
         */
        toJSON(): { DisplayName: string, EmailAddress: string, Username: string}
        {
            return{
                "DisplayName": this.DisplayName,
                "EmailAddress": this.EmailAddress,
                "Username": this.Username,
            }
        }


        fromJSON(data: User): void
        {
            this.DisplayName = data.DisplayName;
            this.EmailAddress = data.EmailAddress;
            this.Username = data.Username;
            this.Password = data.Password;
        }

        // Serialize method
        // Return a string of object or a null
        /**
         * THis method converts the objects properties into a comma separated string
         *
         * @return {(string | null)}
         */
        serialize(): string | null
        {
            if(this.DisplayName !== "" && this.EmailAddress !== "" && this.Username !== "")
            {
                return `${this.DisplayName},${this.EmailAddress},${this.Username}`;
            }
            else
            {
                // Throw an error in console
                console.error("One or more properties of the User is empty");
                return null;
            }
        }

        // Deserialize method
        // Adds object to property array
        /**
         * This method separates a data string into a string array 
         *
         * @param {string} data
         * @returns {void}
         */
        deserialize(data: string)
        {
            let propertyArray: string[] = data.split(",");

            this.DisplayName = propertyArray[0];
            this.EmailAddress = propertyArray[1];
            this.Username = propertyArray[2];
        }


    }





}