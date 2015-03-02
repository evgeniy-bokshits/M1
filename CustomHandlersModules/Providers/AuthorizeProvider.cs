using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;

namespace CustomHandlersModules.Providers
{
    public class AuthorizeProvider
    {
        public static bool LogIn(string email, string password, bool rememberMe = true)
        {
            bool result = false;
            if (ValidateUser(email, password))
            {
                FormsAuthentication.SetAuthCookie(email, rememberMe);
                result = true;
            }
            return result;
        }

        public static void LogOut()
        {
            FormsAuthentication.SignOut();
        }

        private static bool ValidateUser(string username, string password)
        {
            if(username == "test@email.com" && password == "test") return true;
            return false;
        }
    }
}