using System;
using backend.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.DataAccess
{
    public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public DbSet<Team> Teams { get; set; }

        public DbSet<TeamUser> TeamUsers { get; set; }

        public DbSet<Sprint> Sprints { get; set; }

        public DbSet<DayOff> DaysOff { get; set; }

        public DbSet<SprintMember> SprintMembers { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            var team = new Team
            {
                Id = 1,
                Title = "Komanda 69"
            };

            var user1 = new User
            {
                Id = 1,
                FirstName = "Lukas",
                LastName = "Veckys",
                TeamRole = "QA",
                UserName = "Lukas",
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var user2 = new User
            {
                Id = 2,
                FirstName = "Paulius",
                LastName = "Veckys",
                TeamRole = "FE",
                UserName = "Paulius",
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var sprint1 = new Sprint
            {
                Id = 1,
                TeamId = 1,
                Title = "First sprint",
                DefaultLength = 5,
                ActualLength = 6,
                StartDate = DateTime.Today,
                EndDate = DateTime.Today.AddDays(6),
            };

            var sprint2 = new Sprint
            {
                Id = 2,
                TeamId = 1,
                Title = "Second sprint",
                DefaultLength = 3,
                ActualLength = 3,
                StartDate = DateTime.Today,
                EndDate = DateTime.Today.AddDays(3),
            };

            var dayOff1 = new DayOff()
            {
                UserId = 1,
                Id = 1,
                StartDate = DateTime.Parse("2021-05-11"),
                EndDate = DateTime.Parse("2021-05-20"),
                DaysCount = 1,
                Reason = "Luko diena"
            };

            var dayOff2 = new DayOff()
            {
                UserId = 2,
                Id = 2,
                StartDate = DateTime.Parse("2021-05-15"),
                EndDate = DateTime.Parse("2021-05-20"),
                DaysCount = 2,
                Reason = "Pauliaus diena"
            };

            modelBuilder.Entity<TeamUser>()
                .HasKey(tu => new { tu.TeamId, tu.UserId });

            modelBuilder.Entity<TeamUser>()
                .HasOne(tu => tu.Team)
                .WithMany(t => t.TeamUsers)
                .HasForeignKey(tu => tu.TeamId);

            modelBuilder.Entity<TeamUser>()
                .HasOne(tu => tu.User)
                .WithMany(u => u.TeamUsers)
                .HasForeignKey(tu => tu.UserId);

            modelBuilder.Entity<DayOff>()
                .HasOne(d => d.User)
                .WithMany(u => u.DaysOff)
                .HasForeignKey(d => d.UserId);

            modelBuilder.Entity<TeamUser>()
                .HasKey(tu => new { tu.TeamId, tu.UserId });

            modelBuilder.Entity<TeamUser>()
                .HasOne(tu => tu.Team)
                .WithMany(t => t.TeamUsers)
                .HasForeignKey(tu => tu.TeamId);

            modelBuilder.Entity<TeamUser>()
                .HasOne(tu => tu.User)
                .WithMany(u => u.TeamUsers)
                .HasForeignKey(tu => tu.UserId);

            modelBuilder.Entity<DayOff>().HasData(dayOff1, dayOff2);
            modelBuilder.Entity<User>().HasData(user1, user2);
            modelBuilder.Entity<Team>().HasData(team);
            modelBuilder.Entity<Sprint>().HasData(sprint1, sprint2);
            modelBuilder.Entity<TeamUser>().HasData(
                new
                {
                    TeamId = 1,
                    UserId = 1,
                    Capacity = (double) 3,
                },
                new
                {
                    TeamId = 1,
                    UserId = 2,
                    Allocation = (double) 1,
                    Capacity = 3.5,
                });
        }
    }
}
