using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CustomHandlersModules.CustomHandlers
{
    public class HomeHandler:IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            if (context.Request.HttpMethod == "GET")
            {
                if (context.Request.Path == "/Home")
                {
                    this.Index(context);
                }
            }
        }

        public bool IsReusable
        {
            get { return false; }
        }

        private void Index(HttpContext context)
        {

            context.Response.WriteFile("~/Index.html");
        }
    }
}