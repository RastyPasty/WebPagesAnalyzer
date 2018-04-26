using System;
using System.ComponentModel.DataAnnotations;

namespace Data
{
    public sealed class Word
    {
        [StringLength(100)]
        public string Id { get; set; }

        [StringLength(250)]
        public string Data { get; set; }

        public int Count { get; set; }
    }
}
