using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using WebPagesAnalyzer.Repositories.Interfaces;
using WebPagesAnalyzer.Services.Interfaces;

namespace WebPagesAnalyzer.Controllers.Api
{
    [Produces("application/json")]
    [Route("api/Report")]
    public class ReportController : Controller
    {
        private readonly ICryptoService _cryptoService;
        private readonly IWordRepository _wordRepository;
        public ReportController(IWordRepository wordRepository, ICryptoService cryptoService)
        {
            _wordRepository = wordRepository;
            _cryptoService = cryptoService;
        }

        [HttpGet("")]
        public IActionResult GetAllWords()
        {
            var data = _wordRepository
                .GetAll()
                .Select(x => new { Text = _cryptoService.Decrypt(x.Key, Consts.SecretKey), Count = x.Value })
                .OrderByDescending(x => x.Count).ToList();

            return Ok(data);
        }
    }
}
