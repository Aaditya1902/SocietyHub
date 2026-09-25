using Microsoft.OpenApi;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

using SocietyHub.Application.Interfaces;
using SocietyHub.Infrastructure.Services;

using Microsoft.EntityFrameworkCore;
using SocietyHub.Infrastructure.Data;
using SocietyHub.Domain.Entities;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<ISocietyService, SocietyService>();
builder.Services.AddScoped<ITowerService, TowerService>();
builder.Services.AddScoped<IFlatService, FlatService>();
builder.Services.AddScoped<IResidentService, ResidentService>();
builder.Services.AddScoped<IVisitorService, VisitorService>();
builder.Services.AddScoped<IComplaintService, ComplaintService>();
builder.Services.AddScoped<IMaintenanceBillService, MaintenanceBillService>();
builder.Services.AddScoped<IAmenityBookingService, AmenityBookingService>();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    builder.Configuration["Jwt:Key"]!
                )
            )
        };
    });

// OpenAPI
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Enter your JWT token."
    });

    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = []
    });
});

var app = builder.Build();



using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider
        .GetRequiredService<ApplicationDbContext>();

    if (!await context.Amenities.AnyAsync())
    {
        context.Amenities.AddRange(
            new Amenity
            {
                Id = Guid.NewGuid(),
                Name = "Gym",
                Description = "Fully equipped society gym.",
                IsActive = true
            },
            new Amenity
            {
                Id = Guid.NewGuid(),
                Name = "Clubhouse",
                Description = "Common area for society events.",
                IsActive = true
            },
            new Amenity
            {
                Id = Guid.NewGuid(),
                Name = "Swimming Pool",
                Description = "Society swimming pool.",
                IsActive = true
            },
            new Amenity
            {
                Id = Guid.NewGuid(),
                Name = "Community Hall",
                Description = "Hall available for resident events.",
                IsActive = true
            }
        );

        await context.SaveChangesAsync();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("Frontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();