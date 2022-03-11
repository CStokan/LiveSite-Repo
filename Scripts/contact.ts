namespace core
{
    
    export class Contact
    {

        // Private instance members
        private m_fullName: string;
        private m_contactNumber: string;
        private m_emailAddress: string;



        // Public properties (getters and setters)
        public get FullName(): string
        {
            return this.m_fullName;
        }
    
        public set FullName(fullName: string)
        {
            this.m_fullName = fullName;
        }
    
        public get ContactNumber():string
        {
            return this.m_contactNumber;
        }
    
        public set ContactNumber(contactNumber:string)
        {
            this.m_contactNumber = contactNumber;
        }
    
        public get EmailAddress(): string
        {
            return this.m_emailAddress;
        }
    
        public set EmailAddress(emailAddress: string)
        {
            this.m_emailAddress = emailAddress;
        }
    
        // Constructor
        constructor(fullName: string = "", contactNumber: string = "", emailAddress: string = "") // Default parameters
        {
            this.m_fullName = fullName;
            this.m_contactNumber = contactNumber;
            this.m_emailAddress = emailAddress;
        }
    
        // public methods

        /**
         * This method converts the objects properties to a comma-separated string
         *
         * @return {(string | null)}  
         * @memberof Contact
         */
        serialize(): string | null
        {
            if(this.FullName !== "" && this.ContactNumber !== "" && this.EmailAddress !== "")
            {
                return `${this.FullName},${this.ContactNumber},${this.EmailAddress}`;
            }
            else
            {
                console.error("One or more properties of the Contact are missing or empty");
                return null;
            }
        }
    
        // Assume that data is a comma-separated list of properties (strings)

        /**
         * This method separates a data string into a string array 
         *
         * @param {string} data
         * @returns {void}
         */
        deserialize(data: string)
        {
            let propertyArray: string[] = data.split(",");
            this.FullName = propertyArray[0];
            this.ContactNumber = propertyArray[1];
            this.EmailAddress = propertyArray[2];
        }
    
        // Public overrides
        /**
         * This method overrides the bult in toString method
         * and returns a string that contains the values of the 
         * objects properties
         *
         * @override  
         * @returns {string}
         */
        toString()
        {
            return `Full Name: ${this.FullName}\nContact Number: ${this.ContactNumber}\nEmail Address: ${this.EmailAddress}`;
        }
    
    }

}



