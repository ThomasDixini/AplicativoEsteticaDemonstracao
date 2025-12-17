using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EsteticaDominio;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace EsteticaApplication.Jwt
{
    public class JwtService
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<Usuarios> _userManager;
        private readonly SecurityKey _key;

        public JwtService(IConfiguration configuration, UserManager<Usuarios> userManager)
        {
            this._configuration = configuration;
            this._userManager = userManager;
            this._key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]!));
        }

        public async Task<string> CreateToken(Usuarios user)
        {
            var signingCredentials= new SigningCredentials(_key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>{
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.UserName!)
            };

            var roles = await _userManager.GetRolesAsync(user);

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var descriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = signingCredentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(descriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}