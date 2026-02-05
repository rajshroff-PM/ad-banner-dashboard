import {
    Building2,
    Map,
    Monitor,
    Download,
    LocateFixed,
    Smartphone,
    ArrowRight
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';

export function AnalyticsHub() {
    const cards = [
        {
            title: 'Building Usage',
            description: 'Track positioning data of users within the building in real-time.',
            icon: Building2,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Heatmap Visualization',
            description: 'View user location density and traffic patterns with color gradation.',
            icon: Map,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
        {
            title: 'Kiosk Report',
            description: 'Summary of kiosk interactions, search queries, and user engagement.',
            icon: Monitor,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
        {
            title: 'Download Reports',
            description: 'Export comprehensive data sets and manage report downloads effortlessly.',
            icon: Download,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: 'Geofence Analtyics',
            description: 'Analyze visits and dwell times for specific geofenced areas.',
            icon: LocateFixed,
            color: 'text-cyan-600',
            bgColor: 'bg-cyan-100',
        },
        {
            title: 'Mobile App Report',
            description: 'Monitor user visits, app usage trends, and real-time feedback insights.',
            icon: Smartphone,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-100',
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics Hub</h1>
                    <p className="text-gray-500 mt-1">Comprehensive insights and data visualization for your property.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                                        <Icon className={`w-6 h-6 ${card.color}`} />
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors">
                                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AdminLayout>
    );
}
