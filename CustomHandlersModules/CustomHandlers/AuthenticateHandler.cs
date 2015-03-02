using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI.WebControls;
using CustomHandlersModules.Providers;

namespace CustomHandlersModules.CustomHandlers
{
    public class AuthenticateHandler:IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            if (context.Request.HttpMethod == "GET")
            {
                if (context.Request.Path == "/Authenticate/isAuthenticated")
                {
                    this.Authenticated(context);
                }
            }
            else if (context.Request.HttpMethod == "POST")
            {
                if (context.Request.Path == "/Authenticate/LogIn")
                {
                    this.LogIn(context);
                }
                else if (context.Request.Path == "/Authenticate/LogOut")
                {
                    this.LogOut(context);
                }
            }
            
        }

        public bool IsReusable { get { return false; }}

        private void Authenticated(HttpContext context)
        {
            context.Response.ContentType = "text";
            var res = context.User.Identity.IsAuthenticated;
            context.Response.Write(context.User.Identity.IsAuthenticated ? "true" : "false");
        }

        private void LogIn(HttpContext context)
        {
            var email = context.Request.Form["email"];
            var password = context.Request.Form["password"];
            if (!String.IsNullOrWhiteSpace(email) && !String.IsNullOrWhiteSpace(password))
            {
                if (AuthorizeProvider.LogIn(email, password)) context.Response.Redirect("/Home", false);
            }
        }

        private void LogOut(HttpContext context)
        {
            AuthorizeProvider.LogOut();
            context.Response.Redirect("/Home", false);
        }
    }
}