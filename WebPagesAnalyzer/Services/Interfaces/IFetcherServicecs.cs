using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebPagesAnalyzer.Services.Interfaces
{
    public interface IFetcherService
    {
        string Get(string url);
    }
}
