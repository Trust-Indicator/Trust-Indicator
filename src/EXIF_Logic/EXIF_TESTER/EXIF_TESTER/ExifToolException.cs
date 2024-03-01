using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EXIF_TESTER
{
    [Serializable]
    public class ExifToolException : Exception
    {
        public ExifToolException(string msg) : base(msg)
        { }
    }
}
