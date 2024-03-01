using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Trust_Indicator.Data;
using System.Reflection;
using Microsoft.AspNetCore.Authentication;
using Trust_Indicator.Handler;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddFluentValidation(options =>
    {
        options.ImplicitlyValidateChildProperties = true;
        options.ImplicitlyValidateRootCollectionElements = true;
        options.RegisterValidatorsFromAssembly(Assembly.GetExecutingAssembly());
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Database
builder.Services.AddDbContext<MyDbContext>(
    options => options.UseSqlite(builder.Configuration["APIConnection"])
);

// Add Repo
builder.Services.AddScoped<IRepo, Repo>();

// Add authentication
builder.Services
    .AddAuthentication()
    .AddScheme<AuthenticationSchemeOptions, AuthHandler>("MyAuthentication", null);

// Add policy
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("UserOnly", policy => policy.RequireClaim("email"));
});

builder.Services.AddCors(p => p.AddPolicy("corsapp", builder =>
{
    builder.WithOrigins("*").AllowAnyMethod().AllowAnyHeader();
}));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

//app cors
app.UseCors("corsapp");

app.Run();
