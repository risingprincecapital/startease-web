import { Business } from '@/types/business';

interface BusinessDetailsExpandedProps {
    business: Business;
}

export default function BusinessDetailsExpanded({ business }: BusinessDetailsExpandedProps) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    const formatBoolean = (value?: boolean) => {
        return value ? 'Yes' : 'No';
    };

    return (
        <div className="mt-6 space-y-6 border-t border-border pt-6 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Contact Information */}
            <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-muted">Business Address</p>
                        <p className="text-sm text-foreground font-medium">{business.businessAddress || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted">Business Phone</p>
                        <p className="text-sm text-foreground font-medium">{business.businessPhone || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted">Business Email</p>
                        <p className="text-sm text-foreground font-medium">{business.businessEmail || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted">Website</p>
                        {business.website ? (
                            <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline font-medium">
                                {business.website}
                            </a>
                        ) : (
                            <p className="text-sm text-foreground font-medium">-</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Registration Details */}
            <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Registration Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-muted">Legal Name</p>
                        <p className="text-sm text-foreground font-medium">{business.legalName || business.businessName}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted">Tax ID (State)</p>
                        <p className="text-sm text-foreground font-medium">{business.taxId || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted">Registration Date</p>
                        <p className="text-sm text-foreground font-medium">{formatDate(business.registrationDate)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted">BOIR Filed</p>
                        <p className="text-sm text-foreground font-medium">{formatBoolean(business.boirFiled)}</p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-xs text-muted">Nature of Business</p>
                        <p className="text-sm text-foreground font-medium">{business.natureOfBusiness || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Corporate Structure */}
            <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Corporate Structure</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-muted">Incorporation Context</p>
                        <p className="text-sm text-foreground font-medium">{business.incorporationContext || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted">Fundraising Enabled</p>
                        <p className="text-sm text-foreground font-medium">{formatBoolean(business.fundraisingEnabled)}</p>
                    </div>
                    {business.parentCompany && (
                        <>
                            <div>
                                <p className="text-xs text-muted">Parent Company Name</p>
                                <p className="text-sm text-foreground font-medium">{business.parentCompany.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted">Parent Company Country</p>
                                <p className="text-sm text-foreground font-medium">{business.parentCompany.country}</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Registered Agent */}
            {business.regAgentInfo && business.regAgentInfo.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Registered Agent</h3>
                    <div className="space-y-3">
                        {business.regAgentInfo.map((agent, index) => (
                            <div key={index} className="bg-background border border-border rounded p-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-xs text-muted">Name</p>
                                        <p className="text-sm text-foreground font-medium">{agent.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted">Address</p>
                                        <p className="text-sm text-foreground font-medium">{agent.address}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Detailed Founder Info */}
            {business.founderInfo && business.founderInfo.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Founder Details</h3>
                    <div className="space-y-3">
                        {business.founderInfo.map((founder, index) => (
                            <div key={index} className="bg-background border border-border rounded p-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs text-muted">Name</p>
                                        <p className="text-sm text-foreground font-medium">{founder.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted">Email</p>
                                        <p className="text-sm text-foreground font-medium">{founder.email || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted">Role</p>
                                        <p className="text-sm text-foreground font-medium">{founder.role || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted">Phone</p>
                                        <p className="text-sm text-foreground font-medium">{founder.phone || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted">Country</p>
                                        <p className="text-sm text-foreground font-medium">{founder.country}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted">Citizenship</p>
                                        <p className="text-sm text-foreground font-medium">{founder.citizenship || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted">Residency Status</p>
                                        <p className="text-sm text-foreground font-medium">{founder.residencyStatus || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted">ITIN Assigned</p>
                                        <p className="text-sm text-foreground font-medium">{formatBoolean(founder.itin?.assigned)}</p>
                                    </div>
                                    {founder.itin?.assigned && (
                                        <div>
                                            <p className="text-xs text-muted">ITIN Number</p>
                                            <p className="text-sm text-foreground font-medium">{founder.itin?.number || '-'}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-xs text-muted">Visited US for Business</p>
                                        <p className="text-sm text-foreground font-medium">{formatBoolean(founder.visitedUSForBusiness)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted">Compensation Method</p>
                                        <p className="text-sm text-foreground font-medium">{founder.compensationMethod || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted">W8 Provided</p>
                                        <p className="text-sm text-foreground font-medium">{formatBoolean(founder.w8Provided)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
