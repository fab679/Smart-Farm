export default function invoices() {
  return (
    <div className="h-full w-full space-y-2 shadow-sm">
      <div className="flex w-full justify-center lg:justify-start">
        <h2 className="text-2xl text-gray-700">Invoices</h2>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Reciept
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>

              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Request Payment</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                skdwdko2ei29ei2d2kdn
              </th>
              <td className="px-6 py-4">date</td>

              <td className="px-6 py-4">$2999</td>
              <td className="px-6 py-4 text-right">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Pay
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
