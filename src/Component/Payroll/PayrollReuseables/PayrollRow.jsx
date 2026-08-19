const PayrollRow = ({ date, name, status, employees, amount }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {date}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {name}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        <span className="w-2 h-2 mr-1.5 rounded-full bg-purple-800 inline-block"></span>
        {status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {employees}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {amount}
    </td>
  </tr>
);

export default PayrollRow;
