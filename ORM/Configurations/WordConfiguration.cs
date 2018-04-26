using Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace ORM.Configurations
{
    class WordConfiguration : DbEntityConfiguration<Word>
    {
        public override void Configure(EntityTypeBuilder<Word> entity)
        {
            entity.ToTable("Words");
            entity.HasKey(r => r.Id);
        }
    }
}
