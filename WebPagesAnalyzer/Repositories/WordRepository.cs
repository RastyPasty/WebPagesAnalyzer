using Data;
using ORM;
using System.Collections.Generic;
using System.Linq;
using WebPagesAnalyzer.Repositories.Interfaces;

namespace WebPagesAnalyzer.Services
{
    public class WordRepository: IWordRepository
    {
        private WebPagesAnalyzerContext _context;

        public WordRepository(WebPagesAnalyzerContext context)
        {
            _context = context;
        }

        public List<string> GetAllIds()
        {
           return _context.Words.Select(x => x.Id).ToList();
        }

        public Dictionary<string, int> GetAll()
        {
            return _context.Words.ToDictionary(x => x.Data, x => x.Count);
        }

        public void PushData(List<Word> insertData, List<Word> updateData)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                _context.AddRange(insertData);

                foreach (var word in updateData)
                {
                    var entity = _context.Words.Find(word.Id);
                    entity.Count += word.Count;
                }
                _context.SaveChanges();
                transaction.Commit();
            }
        }

     }
}
