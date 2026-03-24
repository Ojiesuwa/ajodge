import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Search, Building2 } from 'lucide-react';
import { apiService } from '../../services/api';
const SearchableSelect = ({ label, id, error, value, onChange }) => {
  const [banksList, setBankList] = useState([

  ]);

  useEffect(() => {
    async function fetchBankList() {
      try {
        const apiBanks = await apiService.getBanks();
        setBankList(apiBanks);
      } catch (err) {
        console.error('Error fetching banks:', err);
      }
    }

    fetchBankList();
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);

  const filteredBanks = banksList.filter((bank) =>
    bank.name.toLowerCase().includes(query.toLowerCase())
  );

  const selectedBank = banksList.find((b) => b.id === value);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="flex flex-col space-y-1.5" ref={containerRef}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <motion.button
          type="button"
          whileTap={{ scale: 0.995 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-3 text-left bg-white border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 hover:border-gray-300'}
          `}
        >
          <span className={`block truncate ${!selectedBank ? 'text-gray-400' : 'text-gray-900'}`}>
            {selectedBank ? selectedBank.name : 'Select a bank'}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-md shadow-lg overflow-hidden"
            >
              <div className="p-2 border-b border-gray-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border-none rounded-md focus:outline-none focus:ring-1 focus:ring-brand"
                    placeholder="Search bank..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <ul className="max-h-60 overflow-y-auto py-1">
                {filteredBanks.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-gray-500 text-center">No banks found</li>
                ) : (
                  filteredBanks.map((bank) => (
                    <li
                      key={bank.id}
                      onClick={() => {
                        onChange(bank);
                        setIsOpen(false);
                        setQuery('');
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-brand-hover" />
                      </div>
                      {bank.name}
                    </li>
                  ))
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 mt-1"
        >
          {error}
        </motion.span>
      )}
    </div>
  );
};

export default SearchableSelect;
