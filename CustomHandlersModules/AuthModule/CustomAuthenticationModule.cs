using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Security;

namespace CustomHandlersModules.AuthModule
{
    public class CustomAuthenticationModule:IHttpModule
    {
        public void Init(HttpApplication context)
        {
            context.AuthenticateRequest += new EventHandler(this.OnAuthenticateRequest);
        }

        public void Dispose()
        {
            throw new NotImplementedException();
        }

        private void OnAuthenticateRequest(Object sender, EventArgs e)
        {
            var application = (HttpApplication)sender;
            var context = application.Context;
            this.Authenticate(context);
        }

        private void Authenticate(HttpContext context)
        {
            HttpCookie authCookie = context.Request.Cookies.Get(FormsAuthentication.FormsCookieName);
            if (authCookie != null && !string.IsNullOrWhiteSpace(authCookie.Value))
            {
                var ticket = FormsAuthentication.Decrypt(authCookie.Value);
                if (ticket != null && !string.IsNullOrWhiteSpace(ticket.Name))
                {
                    context.User = new GenericPrincipal(new GenericIdentity(ticket.Name), null);
                }
            }
        }
    }
}