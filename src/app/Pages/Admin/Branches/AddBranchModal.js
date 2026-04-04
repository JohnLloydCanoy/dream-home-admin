import Button from '../../../../../global-components/ui/Button';
import Dialog from '../../../../../global-components/ui/Dialog';

export default function AddBranchModal({ isOpen, onClose, onSuccess }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        street: '',
        area: '',
        city: '',
        postcode: '',
        telephone_no: '',
        fax_no: ''
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('adminAccessToken');
            const response = await fetch(`${API_URL}/branches/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(JSON.stringify(errData));
            }

            // Reset form and notify parent to refresh the table
            setFormData({ street: '', area: '', city: '', postcode: '', telephone_no: '', fax_no: '' });
            onSuccess(); 

        } catch (error) {
            console.error("Submission Error:", error);
            alert("Failed to add branch. Check console for details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog 
            isOpen={isOpen} 
            onClose={onClose}
            title="Register New Branch"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase">Street Address <span className="text-red-500">*</span></label>
                    <input type="text" name="street" required value={formData.street} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="123 Main St" />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase">Area</label>
                    <input type="text" name="area" value={formData.area} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Downtown (Optional)" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">City <span className="text-red-500">*</span></label>
                        <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="London" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Postcode <span className="text-red-500">*</span></label>
                        <input type="text" name="postcode" required value={formData.postcode} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="SW1A 1AA" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Telephone <span className="text-red-500">*</span></label>
                        <input type="text" name="telephone_no" required value={formData.telephone_no} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="+44 20..." />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 uppercase">Fax No</label>
                        <input type="text" name="fax_no" value={formData.fax_no} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="(Optional)" />
                    </div>
                </div>

                {/* Dialog Actions */}
                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSubmitting}>
                        Save Branch
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}