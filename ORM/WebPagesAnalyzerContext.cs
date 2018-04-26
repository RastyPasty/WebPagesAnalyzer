using Data;
using Microsoft.EntityFrameworkCore;

namespace ORM
{
    public class WebPagesAnalyzerContext : DbContext
    {
        public WebPagesAnalyzerContext(DbContextOptions<WebPagesAnalyzerContext> options)
    : base(options)
        {
        }

        public DbSet<Word> Words { get; set; }
    }
}
