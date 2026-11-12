
import { useEffect, useState } from 'react';
import { getGames } from '../../data/gameCatalog';
import {
  getGameKeys,
  addGameKeys,
  deleteGameKey
} from '../../data/keyInventory';

function AdminKeys() {
  const [games] = useState(getGames);
  const [selectedId, setSelectedId] = useState(
    games.length > 0 ? String(games[0].id) : ''
  );
  const [keys, setKeys] = useState([]);
  const [newKeys, setNewKeys] = useState('');

  const selectedGame = games.find(
    (game) => String(game.id) === selectedId
  );

  useEffect(() => {
    if (selectedGame) {
      setKeys(getGameKeys(selectedGame));
    } else {
      setKeys([]);
    }
  }, [selectedGame]);

  function handleAddKeys(e) {
    e.preventDefault();

    if (!selectedGame) return;

    const keyList = newKeys
      .split('\n')
      .map((key) => key.trim())
      .filter((key) => key !== '');

    if (keyList.length === 0) {
      alert('กรุณากรอก CD-Key');
      return;
    }

    const updatedKeys = addGameKeys(selectedGame, keyList);

    setKeys([...updatedKeys]);
    setNewKeys('');

    alert('เพิ่ม CD-Key เรียบร้อยแล้ว');
  }

  function handleDeleteKey(key) {
    if (!window.confirm('ต้องการลบ CD-Key นี้ใช่หรือไม่?')) {
      return;
    }

    const updatedKeys = deleteGameKey(selectedGame, key);
    setKeys([...updatedKeys]);
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">จัดการ CD-Key</h2>
        <p className="mt-2 text-sm text-gray-400">
          ดู เพิ่ม และลบ CD-Key แยกตามเกม
        </p>
      </div>

      {games.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#12121d] p-8 text-center text-gray-400">
          กรุณาเพิ่มเกมก่อนจัดการ CD-Key
        </div>
      ) : (
        <>
          <div className="mb-6 rounded-2xl border border-white/10 bg-[#12121d] p-5">
            <label className="mb-3 block text-sm text-gray-400">
              เลือกเกม
            </label>

            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#09090f] p-3 text-white outline-none focus:border-purple-500 md:max-w-md"
            >
              {games.map((game) => (
                <option key={game.id} value={String(game.id)}>
                  {game.title}
                </option>
              ))}
            </select>

            <div className="mt-5 rounded-xl bg-[#09090f] p-5">
              <p className="text-sm text-gray-400">CD-Key คงเหลือ</p>
              <p className="mt-2 text-3xl font-bold text-green-400">
                {keys.length.toLocaleString('th-TH')} คีย์
              </p>
            </div>
          </div>

          <form
            onSubmit={handleAddKeys}
            className="mb-8 rounded-2xl border border-white/10 bg-[#12121d] p-5"
          >
            <h3 className="mb-3 text-lg font-bold">เพิ่ม CD-Key</h3>
            <p className="mb-3 text-sm text-gray-400">
              กรอกคีย์แต่ละรายการแยกคนละบรรทัด
            </p>

            <textarea
              value={newKeys}
              onChange={(e) => setNewKeys(e.target.value)}
              rows="5"
              placeholder={'XXXX-XXXX-XXXX\nYYYY-YYYY-YYYY'}
              className="w-full rounded-lg border border-white/10 bg-[#09090f] p-3 text-white outline-none focus:border-purple-500"
            />

            <button
              type="submit"
              className="mt-4 rounded-lg bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-500"
            >
              เพิ่ม CD-Key
            </button>
          </form>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121d]">
            <div className="border-b border-white/10 p-5">
              <h3 className="font-bold">รายการ CD-Key</h3>
              <p className="mt-1 text-sm text-gray-500">
                {selectedGame?.title}
              </p>
            </div>

            {keys.length === 0 ? (
              <p className="p-8 text-center text-gray-400">
                ไม่มี CD-Key คงเหลือ
              </p>
            ) : (
              <div className="divide-y divide-white/5">
                {keys.map((key, index) => (
                  <div
                    key={`${key}-${index}`}
                    className="flex flex-wrap items-center justify-between gap-3 p-4"
                  >
                    <div>
                      <span className="mr-3 text-xs text-gray-500">
                        {index + 1}.
                      </span>
                      <span className="break-all font-mono text-sm text-gray-200">
                        {key}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteKey(key)}
                      className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400 hover:bg-red-500/20"
                    >
                      ลบคีย์
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminKeys;
