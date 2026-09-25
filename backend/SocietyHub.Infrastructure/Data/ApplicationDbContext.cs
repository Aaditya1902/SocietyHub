using Microsoft.EntityFrameworkCore;
using SocietyHub.Domain.Entities;

namespace SocietyHub.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<Society> Societies => Set<Society>();

    public DbSet<Tower> Towers => Set<Tower>();

    public DbSet<Flat> Flats => Set<Flat>();

    public DbSet<FlatResident> FlatResidents => Set<FlatResident>();
    public DbSet<Visitor> Visitors => Set<Visitor>();
    public DbSet<Complaint> Complaints => Set<Complaint>();
    public DbSet<MaintenanceBill> MaintenanceBills => Set<MaintenanceBill>();
    public DbSet<Amenity> Amenities => Set<Amenity>();

public DbSet<AmenityBooking> AmenityBookings => Set<AmenityBooking>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>()
            .HasKey(user => user.Id);

        modelBuilder.Entity<User>()
            .HasIndex(user => user.Email)
            .IsUnique();

        // Society -> Tower
        modelBuilder.Entity<Tower>()
            .HasOne(tower => tower.Society)
            .WithMany(society => society.Towers)
            .HasForeignKey(tower => tower.SocietyId)
            .OnDelete(DeleteBehavior.Cascade);

        // Tower -> Flat
        modelBuilder.Entity<Flat>()
            .HasOne(flat => flat.Tower)
            .WithMany(tower => tower.Flats)
            .HasForeignKey(flat => flat.TowerId)
            .OnDelete(DeleteBehavior.Cascade);

        // User -> FlatResident
        modelBuilder.Entity<FlatResident>()
            .HasOne(resident => resident.User)
            .WithMany(user => user.FlatResidencies)
            .HasForeignKey(resident => resident.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Flat -> FlatResident
        modelBuilder.Entity<FlatResident>()
            .HasOne(resident => resident.Flat)
            .WithMany(flat => flat.Residents)
            .HasForeignKey(resident => resident.FlatId)
            .OnDelete(DeleteBehavior.Cascade);

        // Prevent duplicate User + Flat relationship
        modelBuilder.Entity<FlatResident>()
            .HasIndex(resident => new
            {
                resident.UserId,
                resident.FlatId
            })
            .IsUnique();

            modelBuilder.Entity<Visitor>()
    .HasOne(visitor => visitor.Flat)
    .WithMany()
    .HasForeignKey(visitor => visitor.FlatId)
    .OnDelete(DeleteBehavior.Restrict);

modelBuilder.Entity<Visitor>()
    .HasOne(visitor => visitor.CreatedByUser)
    .WithMany()
    .HasForeignKey(visitor => visitor.CreatedByUserId)
    .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<Visitor>()
    .HasOne(visitor => visitor.ApprovedByUser)
    .WithMany()
    .HasForeignKey(visitor => visitor.ApprovedByUserId)
    .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<Complaint>()
    .HasOne(complaint => complaint.Flat)
    .WithMany()
    .HasForeignKey(complaint => complaint.FlatId)
    .OnDelete(DeleteBehavior.Restrict);

modelBuilder.Entity<Complaint>()
    .HasOne(complaint => complaint.CreatedByUser)
    .WithMany()
    .HasForeignKey(complaint => complaint.CreatedByUserId)
    .OnDelete(DeleteBehavior.Restrict);

modelBuilder.Entity<Complaint>()
    .HasOne(complaint => complaint.AssignedStaff)
    .WithMany()
    .HasForeignKey(complaint => complaint.AssignedStaffId)
    .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<MaintenanceBill>()
    .HasOne(bill => bill.Flat)
    .WithMany()
    .HasForeignKey(bill => bill.FlatId)
    .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<AmenityBooking>()
    .HasOne(booking => booking.Amenity)
    .WithMany()
    .HasForeignKey(booking => booking.AmenityId)
    .OnDelete(DeleteBehavior.Restrict);

modelBuilder.Entity<AmenityBooking>()
    .HasOne(booking => booking.User)
    .WithMany()
    .HasForeignKey(booking => booking.UserId)
    .OnDelete(DeleteBehavior.Restrict);
    }
}