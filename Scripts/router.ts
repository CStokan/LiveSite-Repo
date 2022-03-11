// This is a router file to direct the user around the website
namespace core
{
    export class Router
    {

        // Private instance memebers
        private m_activeLink: string;
        private m_routingTable: string[];
        private m_linkData: string;

        // Public proerties - Getters/Setters

        /**
         * @returns {string}
         */
        get LinkData(): string
        {
            return this.m_linkData;
        }

        /**
         * @param {string} link
         * @returns {void}
         */
        set LinkData(link: string)
        {
            this.m_linkData = link;
        }
        /**
         * @returns {string}
         */
        get ActiveLink(): string
        {
            return this.m_activeLink;
        }

        /**
         * @param {string} link
         * @returns {void}
         */
        set ActiveLink(link)
        {
            this.m_activeLink = link;
        }

        // Constructor

        /**
         * Creates an instance of Router.
         * 
         * @constructor Router
         */
        constructor()
        {
            this.m_activeLink = "";
            this.m_linkData = "";
            this.m_routingTable = []; // Creates an empty string array container
        }

        // Public methods
    
        /**
         * This method adds a new route to the routing table
         * 
         * @param {string} route
         * @return {void}
         */
        Add(route: string): void
        {
            this.m_routingTable.push(route);
        }

        /**
         * This method replaces the reference for the routing table with a new one
         * Note: Routes should begin with a '/' char
         *
         * @param {string[]} routingTable
         * @return {void}
         */
        AddTable(routingTable: string[]): void
        {
            this.m_routingTable = routingTable;
        }


        /**
         * This method finds and returns index of the route in the routing table
         * otherwise, it returns -1 if the route is not found
         * 
         * @param {string} route
         * @return {number} 
         */
        Find(route: string): number
        {
            return this.m_routingTable.indexOf(route);
        }


        /**
         * This method removes a route from the routing table 
         * It returns true if the route was successfully removed
         * Otherwise false
         *
         * @param {string} route
         * @returns {boolean}
         */
        Remove(route: string): boolean
        {
            // If route is found
            if(this.Find(route) > -1)
            {
                // Remove the route
                this.m_routingTable.splice(this.Find(route), 1);

                return true;
            }
            return false;
        }

        // Public override methods
        /**
         * This method overrides the built-in toString method and
         * returns the routing table as a comma seperated string
         *
         * @override
         * @returns {string}
         */
        toString(): string
        {
            return this.m_routingTable.toString();
        }


    }

    

}

let router: core.Router = new core.Router();

router.AddTable([
    "/", // default route
    "/home",
    "/about",
    "/services",
    "/contact",
    "/contact-list",
    "/products",
    "/register",
    "/login",
    "/edit"
]);
let route: string = location.pathname; // alias for location.pathname

// if route is found in the Routing Table
router.ActiveLink = (router.Find(route) > -1) ? (route == "/") ? "home" : route.substring(1) : "404";
