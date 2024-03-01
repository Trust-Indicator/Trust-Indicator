using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using Trust_Indicator.Data;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;

namespace Trust_Indicator.Handler
{
    public class AuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly IRepo _repo;

        public AuthHandler(
            IRepo repo,
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock)
            : base(options, logger, encoder, clock)
        {
            _repo = repo;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Headers.ContainsKey("Authorization"))
            {
                Response.Headers.Add("WWW-Authenticate", "Basic");
                return AuthenticateResult.Fail("Authorization header not found.");
            }
            else
            {
                var authHeader = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
                var credentialBytes = Convert.FromBase64String(authHeader.Parameter);
                var credentials = Encoding.UTF8.GetString(credentialBytes).Split(":");
                var email = credentials[0];
                var password = credentials[1];

                if (_repo.ValidLogin(email, password))
                {
                    // user
                    var claims = new[] { new Claim("email", email) };
                    ClaimsIdentity identity = new ClaimsIdentity(claims, "Basic");
                    ClaimsPrincipal principal = new ClaimsPrincipal(identity);
                    AuthenticationTicket ticket = new AuthenticationTicket(principal, Scheme.Name);
                    return AuthenticateResult.Success(ticket);
                }
                Response.Headers.Add("WWW-Authenticate", "Basic");
                return AuthenticateResult.Fail("Authorization header not found.");
            }

        }
    }
}