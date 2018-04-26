using Data;
using System.Collections.Generic;
using System.Linq;
using WebPagesAnalyzer.Repositories.Interfaces;

namespace WebPagesAnalyzer.Services.Interfaces
{
    public sealed class PageHandlerService : IPageHandlerService
    {
        private readonly ICryptoService _cryptoService;
        private readonly IFetcherService _fetcherService;
        private readonly IWordRepository _wordRepository;

        public PageHandlerService(ICryptoService cryptoService,
            IFetcherService fetcherService,
            IWordRepository wordRepository)
        {
            _cryptoService = cryptoService;
            _fetcherService = fetcherService;
            _wordRepository = wordRepository;
        }

        public bool Process(string url)
        {
            var pageContent = _fetcherService.Get(url);
            var topWords = GetTextFrequentWords(pageContent);

            var newWords = new List<Word>();
            var updateWords = new List<Word>();

            var existingWords = _wordRepository.GetAllIds();

            foreach (var obj in topWords)
            {
                var needInsert = true;

                foreach (var id in existingWords)
                {
                    //possible some perfomance issues,
                    //adding CacheService can solve this
                    if (_cryptoService.VerifySaltedHash(id, obj.Key))
                    {
                        needInsert = false;
                        updateWords.Add(new Word
                        {
                            Id = id,
                            Count = obj.Value
                        });
                        break;
                    }
                }

                if (needInsert)
                {
                    newWords.Add(new Word
                    {
                        Id = _cryptoService.GetSaltedHash(obj.Key),
                        Data = _cryptoService.Encrypt(obj.Key, Consts.SecretKey),
                        Count = obj.Value
                    });
                }
            }

            _wordRepository.PushData(newWords, updateWords);

            return true;
        }

        private Dictionary<string, int> GetTextFrequentWords(string text)
        {
            var data = text.Split(' ');
            return data.Where(x => x.Length > 2)
                .GroupBy(x => x)
                .Select(x => new { Key = x.Key, Value = x.Count() })
                .OrderByDescending(x => x.Value)
                .Take(Consts.TopAmmount)
                .ToDictionary(x => x.Key, x => x.Value);
        }
    }
}
