using System.Collections.Generic;

namespace WebPagesAnalyzer.Services.Interfaces
{
    public interface IParserService
    {
        Dictionary<string, int> Parse(string text);
    }
}
