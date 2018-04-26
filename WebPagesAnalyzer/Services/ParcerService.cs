using System.Collections.Generic;
using System.Linq;
using WebPagesAnalyzer.Services.Interfaces;

namespace WebPagesAnalyzer.Services
{
    public class ParserService : IParserService
    {
        public Dictionary<string, int> Parse(string text)
        {
            var data = text.Split(' ');
            return data.Where(x => x.Length > 2)
                .GroupBy(x => x)
                .Select(x => new { Key = x.Key, Value = x.Count()})
                .OrderByDescending(x => x.Value)
                .Take(100)
                .ToDictionary(x => x.Key, x => x.Value);
        }
    }
}
